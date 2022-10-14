import { createClient, PostgrestError } from "@supabase/supabase-js";
import config from 'config';

const { thirdParty: { supabase } } = config;

const supabaseClient = createClient(
    supabase.URL,
    supabase.ANON_KEY,
)

interface ViewResponse {
    data?: { count: number };
    error?: PostgrestError
}

interface SupabaseResponse {
    view: ViewResponse
}

const getView = async (slug: string): Promise<number> => {
    const { data: views, error }: SupabaseResponse['view'] = await supabaseClient
        .from('views')
        .select(`count`)
        .match({ slug })
        .single();

    if (error && error.details.includes(`0 rows`)) {
        const { data, error }: SupabaseResponse['view'] = await supabaseClient
            .from(`views`)
            .insert({ slug: slug, count: 1 }, { returning: `representation` })
            .single();
        return data.count;
    }
    if (!views) {
        return 0;
    }
    return views.count;
}

const registerView = async (slug: string): Promise<void> => {
    await supabaseClient.rpc('increment', {
        slug_text: slug
    })
}

export {
    getView,
    registerView
}