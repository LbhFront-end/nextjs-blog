export interface PostData {
    id: string;
    title: string;
    date: string;
    contentHtml: string;
    totalWords: number;
    tags?: string;
    categories?: string[];
    body: {
        raw: string;
        html: string;
    },
    _id: string;
    _raw: {
        sourceFilePath: string;
        sourceFileName: string;
        sourceFileDir: string;
        contentType: string;
        flattenedPath: string;
    };
    type: string;
    url: string;
}