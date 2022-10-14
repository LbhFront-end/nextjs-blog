import { getView, registerView } from 'lib';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ViewData {
    message?: string;
    status?: number;
    count?: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ViewData>
): Promise<void> {
    const slug = req.query.slug.toString();
    if (!slug) {
        return res.status(400).json({ message: `invalid slug` });
    }
    if (req.method === 'POST') {
        await registerView(slug);
    }
    const count = await getView(slug);
    return res.status(200).json({ count })
}