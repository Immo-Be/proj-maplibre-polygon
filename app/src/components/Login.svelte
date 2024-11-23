<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { pb } from '$lib/pocketbase';
	import { toast } from 'svelte-sonner';
	let loading = $state(false);

	const submitLogin = () => {
		return async ({ result, update }) => {
			loading = true;
			switch (result.type) {
				case 'success':
					pb.authStore.loadFromCookie(document.cookie);
					await applyAction(result);

					await update();
					toast.success('Login erfolgreich', { duration: 3000 });
					break;
				// Todo: Implement form validation
				// see e.g. https://github.com/huntabyte/showcase/blob/episode-6/apps/web/src/routes/login/%2Bpage.server.js
				// case 'invalid':
				// 	toast.error('Invalid credentials');
				// 	await update();
				// 	break;
				case 'error':
					toast.error(result.error.message);
					break;
				default:
					await update();
			}
			loading = false;
		};
	};
</script>

<form use:enhance={submitLogin} method="POST" action="?/login">
	<Card.Root class="w-full max-w-sm ">
		<Card.Header>
			<Card.Title class="text-2xl ">Login</Card.Title>
			<Card.Description>Gib hier E-Mail und Passwort ein, um dich einzuloggen</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="user@seefalke.info"
					name="email"
					value=""
					required
				/>
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input id="password" type="password" name="password" value="" required />
			</div>
		</Card.Content>
		<Card.Footer>
			<Button class="w-full" type="submit" disabled={loading}>Einloggen</Button>
		</Card.Footer>
	</Card.Root>
</form>
