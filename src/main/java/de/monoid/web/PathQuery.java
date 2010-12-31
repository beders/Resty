package de.monoid.web;

/** Abstraction for queries into complex datastructures.
 * 
 * @author beders
 *
 * @param <T> the resource to operate on
 */

public abstract class PathQuery<T,S> {
	abstract S eval(T resource) throws Exception;
}
