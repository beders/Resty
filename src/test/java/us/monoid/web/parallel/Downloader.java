package us.monoid.web.parallel;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import us.monoid.web.Resty;

public class Downloader {
	
	public static void main(String[] args) throws InterruptedException, ExecutionException {
		ExecutorService pool = Executors.newFixedThreadPool(10);
		List<Callable<File>> tasks = new ArrayList<Callable<File>>(args.length);
		for (final String url : args) {
			tasks.add(new Callable<File>() {
				public File call() throws Exception {
					return new Resty().bytes(url).save(File.createTempFile("img", ".png"));
				}				
			});
		}
		List<Future<File>> results = pool.invokeAll(tasks);
		for (Future<File> ff : results) {
			System.out.println(ff.get());
		}
	}

}
