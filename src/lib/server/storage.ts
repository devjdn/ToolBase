import { supabase } from '#lib/server/supabase.js';

const BUCKET = 'ToolBase Images';

export async function uploadLogo(file: File): Promise<string> {
	const ext = file.name.split('.').pop();
	const name = `${crypto.randomUUID()}.${ext}`;
	const { error } = await supabase.storage.from(BUCKET).upload(name, file, { contentType: file.type, upsert: false });
	if (error) throw new Error('Failed to upload logo');
	return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
}

export async function removeLogo(url: string | null) {
	const name = url?.split('/').pop();
	if (!name) return;
	const { error } = await supabase.storage.from(BUCKET).remove([name]);
	if (error) console.error('Logo removal failed', error);
}
