import { createClient, PostgrestError } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

interface ViewResponse {
    data?: { count: number };
    error?: PostgrestError
}

interface SupabaseResponse {
    view: ViewResponse
}

const getView = async (slug: string): Promise<number> => {
    const { data: views, error }: SupabaseResponse['view'] = await supabase
        .from('views')
        .select(`count`)
        .match({ slug })
        .single();

        if (error && error.details.includes(`0 rows`)) {
            const { data, error }: SupabaseResponse['view'] = await supabase
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
    await supabase.rpc('increment', {
        slug_text: slug
    })
}

export {
    getView,
    registerView
}