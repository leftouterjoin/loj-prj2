package pkg1;

import java.io.File;
import java.io.IOException;

import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.NotFoundException;

import org.junit.Test;

public class Test1 {
	public void rewriteGetter(String fqcn, String methodName, String expression)
			throws NotFoundException, CannotCompileException, IOException {
		ClassPool cp = ClassPool.getDefault();

		CtClass cc = cp.get(fqcn);

		CtMethod cm = cc.getDeclaredMethod(methodName);

		cm.setBody("{ return " + expression + "; }");

		String outpath = (new File(".")).getAbsolutePath() + "/bin/";
		cc.writeFile(outpath);
	}

	@Test
	public void test1() throws Exception {
		ClassPool cp = ClassPool.getDefault();

		CtClass cc = cp.get("pkg1.Guinea1");

		CtMethod cm = cc.getDeclaredMethod("getId");

		cm.setBody("{ return \"ABCD\"; }");

		String outpath = (new File(".")).getAbsolutePath() + "/bin/";
		cc.writeFile(outpath);
		Class clazz = cc.toClass();
		Guinea1 g1 = (Guinea1) clazz.newInstance();

		System.out.println(g1.getId());
	}

	@Test
	public void test2() {
		Guinea1 g1 = new Guinea1();
		System.out.println(g1.getId());
	}
}
