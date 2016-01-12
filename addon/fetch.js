/*global FastBoot*/
import browserFetch from "fetch/browser";
import fastbootFetch from "fetch/fastboot";

export default browserFetch || fastbootFetch;
