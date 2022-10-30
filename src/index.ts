import {Router, Request} from "itty-router"
export interface Env {
	// The latest version that is currently available AND known to be stable.
	// It MAY differ from the latest release.
	LATEST_VERSION: string
}

const HOME_URL = "https://github.com/ddavness/power-mailinabox"
const TARGET_URL = "https://raw.githubusercontent.com/ddavness/power-mailinabox/VERSION/setup/bootstrap.sh" // Where _ is to be filled in

const router = Router()

function neg_response(): Response {
	return new Response("Nothing here!\n\nBut you're welcome to check me out at https://power-mailinabox.net", {
		status: 404
	})
}

function redirect(target: string): Response {
	return new Response(undefined, {
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

const version_regex = /^v(?:\d+\.)+(?:\d+|POWER\.\d+)$/g

router.get("/:version/setup.sh", (req: Request) => {
	let version = req.params!.version
	if (!version_regex.test(version)) {
		return neg_response()
	}
	return redirect(TARGET_URL.replace("VERSION", version))
})

router.get("/:version", (req: Request) => {
	let version = req.params!.version
	if (!version_regex.test(version)) {
		return neg_response()
	}
	return redirect(`${HOME_URL}/releases/tag/${version}`)
})

router.all("*", () => {
	return neg_response()
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
