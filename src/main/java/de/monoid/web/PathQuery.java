package de.monoid.web;


public abstract class PathQuery<T> {
	abstract Object eval(T resource) throws Exception;
}
