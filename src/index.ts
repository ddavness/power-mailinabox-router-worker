import {Router} from "itty-router"
export interface Env {
	// The latest version that is currently available AND known to be stable.
	// It MAY differ from the latest release.
	LATEST_VERSION: string
}

const HOME_URL = "https://github.com/ddavness/power-mailinabox/"
const TARGET_URL = "https://raw.githubusercontent.com/ddavness/power-mailinabox/VERSION/setup/bootstrap.sh" // Where _ is to be filled in

const router = Router()

function redirect(target: string): Response {
	return new Response("", {
		status: 302, // Temporary Redirect, since the value may change over time
		headers: {
			"Location": target
		}
	})
}

router.get("/", () => {
	return redirect(HOME_URL)
})

router.get("/setup.sh", (_: Request, env: Env) => {
	return redirect(TARGET_URL.split("VERSION").join(env.LATEST_VERSION))
})

router.all("*", () => {
	let neg_response = new Response("Nothing here!\n\nBut you're welcome to check me out at https://power-mailinabox.net", {
		status: 404
	})

	return neg_response
})

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		return router.handle(request, env);
	}
};
