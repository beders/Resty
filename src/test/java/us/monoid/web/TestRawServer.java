/**
 * 
 */
package us.monoid.web;

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author beders
 *
 */
public class TestRawServer {

	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws IOException {
		System.out.println("Starting raw server on socket 9998");
		ServerSocket ss = new ServerSocket(9998);
    while (true) {
    	System.out.println("Ready to accept");
    	Socket s = ss.accept();
    	InputStream inputStream = s.getInputStream();
    	byte[] buffer = new byte[1024];
  		int len = -1;
  		while ((len = inputStream.read(buffer)) != -1) {
  			System.out.write(buffer, 0, len);
  		}
  		inputStream.close();
  		s.getOutputStream().close();
  		s.close();
    }

	}

}
