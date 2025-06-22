import addSite from '$lib/addSite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    await addSite(`https://${Math.random().toString(36).slice(2)}.com`);
    return {};
};