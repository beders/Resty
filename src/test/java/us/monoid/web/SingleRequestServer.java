/**
 *
 */
package us.monoid.web;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * Simple server for use in tests. In tests it's common that you want to spawn a server that listens on a port for a
 * single request and sends some preset response. In the test you will most likely also want to verify that the request
 * looks in a certain way. This class is created for those cases.
 * <p/>
 * Example usage:
 * <pre>
 * SingleRequestServer server = new SingleRequestServer();
 * server.setResponse("HTTP/1.1 200 OK\nConnection: close\n\nHello, World!");
 * int port = server.start();
 *
 * System.out.println(new Resty().text("http://localhost:" + port + "/").toString());
 * </pre>
 */
public class SingleRequestServer {

	private ServerSocket ss;
	private String lastRequest;
	private String response;

	public SingleRequestServer() {
	}

	public int start() {
		try {
			ss = new ServerSocket(0);

			// The server socket will choose a free port to listen to
			System.out.printf("Starting raw server on socket %d%n", ss.getLocalPort());

			new Thread(new Runnable() {
				@Override
				public void run() {
					Socket socket;
					try {
						socket = ss.accept();

						// Read request
						BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
						StringBuilder request = new StringBuilder();

						while (!request.toString().endsWith("\n\n")) {
							request.append(br.readLine()).append("\n");
						}

						lastRequest = request.toString();
						System.out.println("Got request " + lastRequest);

						// Send response
						PrintWriter pw = new PrintWriter(socket.getOutputStream());
						pw.write(response);
						pw.close();
						br.close();
					} catch (IOException e) {
						throw new RuntimeException("Got exception while waiting for a connection", e);
					} finally {
						try {
							ss.close();
						} catch (IOException e) {
							throw new RuntimeException("Could not close the server socket", e);
						}
					}
				}
			}).start();

			return ss.getLocalPort();
		} catch (IOException e) {
			throw new RuntimeException("Could not start server because of exception", e);
		}
	}

	public String getLastRequest() {
		return lastRequest;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	/**
	 * Main method for manual invocation.
	 */
	public static void main(String[] args) throws IOException {
		SingleRequestServer ts = new SingleRequestServer();
		ts.setResponse("HTTP/1.1 200 OK\nConnection: close\n\nHello, World!");
		ts.start();
	}
}
