package com.googlecode.loj.tools.xml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;

import com.googlecode.loj.tools.xml.XpathExpression;

public class XpathExpressionTest {

	@Test
	public void test1() {

		List<XpathExpression> list = new ArrayList<XpathExpression>();

		list.add(new XpathExpression(null, null));
		list.add(new XpathExpression("C", "2"));
		list.add(new XpathExpression("BB", "1"));
		list.add(new XpathExpression("B", "2"));
		list.add(new XpathExpression("C", "1"));
		list.add(new XpathExpression("C", "1"));
		list.add(new XpathExpression("A", "3"));
		list.add(new XpathExpression("Z", "1"));
		list.add(new XpathExpression("AA", "1"));
		list.add(new XpathExpression("", null));
		list.add(new XpathExpression(null, ""));
		list.add(new XpathExpression(null, null));

		Collections.sort(list);

		Assert.assertThat(new XpathExpression(null, null), CoreMatchers.is(list
			.get(0)));
		Assert.assertThat(new XpathExpression(null, null), CoreMatchers.is(list
			.get(1)));
		Assert.assertThat(new XpathExpression(null, ""), CoreMatchers.is(list
			.get(2)));
		Assert.assertThat(new XpathExpression("", null), CoreMatchers.is(list
			.get(3)));
		Assert.assertThat(new XpathExpression("A", "3"), CoreMatchers.is(list
			.get(4)));
		Assert.assertThat(new XpathExpression("AA", "1"), CoreMatchers.is(list
			.get(5)));
		Assert.assertThat(new XpathExpression("B", "2"), CoreMatchers.is(list
			.get(6)));
		Assert.assertThat(new XpathExpression("BB", "1"), CoreMatchers.is(list
			.get(7)));
		Assert.assertThat(new XpathExpression("C", "1"), CoreMatchers.is(list
			.get(8)));
		Assert.assertThat(new XpathExpression("C", "1"), CoreMatchers.is(list
			.get(9)));
		Assert.assertThat(new XpathExpression("C", "2"), CoreMatchers.is(list
			.get(10)));
		Assert.assertThat(new XpathExpression("Z", "1"), CoreMatchers.is(list
			.get(11)));
	}

}
