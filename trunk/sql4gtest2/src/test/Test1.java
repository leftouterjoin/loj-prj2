package test;

import java.util.logging.Logger;

import org.junit.Test;

public class Test1 {
	private static final Logger logger = Logger
	.getLogger(Test1.class.getName());

	@Test
	public void test1() {
		System.out.println(String.format("%1$0100d", 2));
		logger.info("aaa");
	}

}
