package pkg1;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.NotFoundException;

import org.junit.Test;

public class Test1 {

	@Test
	public void test01() throws Exception {
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

		System.out.println("何か入力>");
		String line = br.readLine();
		System.out.println(line);
	}

	@Test
	public void test3() throws Exception {
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

		System.out.println("クラスパスを入力:");
		String pathname = br.readLine();
		System.out.println("FQCNを入力:");
		String fqcn = br.readLine();
		System.out.println("メソッド名を入力:");
		String methodName = br.readLine();
		System.out.println("戻り値を入力:");
		String expression = br.readLine();

		System.out.printf("%s\n%s\n%s\n%s", pathname, fqcn, methodName,
				expression);
	}

	public void rewriteGetter(String pathname, String fqcn, String methodName,
			String expression) throws NotFoundException,
			CannotCompileException, IOException {
		ClassPool cp = new ClassPool();
		cp.appendClassPath(pathname);

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
