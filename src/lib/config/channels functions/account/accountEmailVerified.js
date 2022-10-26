import { get } from "svelte/store";
import { userData, notifs } from "$lib/stores/global-store";
import bcrypt from 'bcryptjs'

export default {
  accountEmailVerified: data => {
    let userDataCopy = get(userData);
		userDataCopy.verified = data.verified;
		userData.set(userDataCopy);

		notifs.set([
			...get(notifs),
			{
				msg: 'Email verified!',
				type: 'success',
				id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
			}
		]);
  }
}