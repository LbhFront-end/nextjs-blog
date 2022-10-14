import { useState, useCallback, useEffect } from "react"
import Image from 'next/image'
import Link from 'next/link'
import algoliasearch from "algoliasearch"
import classNames from "classnames";
import { useDebounce } from "hooks";
import config from 'config';

const { thirdParty: { algolia } } = config;

interface Result {
    hits: any[];
    page: number;
    length?: number;
    offset?: number;
    nbHits: number;
    nbSortedHits?: number;
    nbPages: number;
    hitsPerPage: number;
    processingTimeMS: number;
    exhaustiveNbHits: boolean;
    exhaustiveFacetsCount?: boolean;
    facets?: Record<string, Record<string, number>>;
    facets_stats?: Record<string, {
        min: number;
        max: number;
        avg: number;
        sum: number;
    }>;
    query: string;
    queryAfterRemoval?: string;
    params: string;
    queryID?: string;
    message?: string;
    aroundLatLng?: string;
    automaticRadius?: string;
    serverUsed?: string;
    index?: string;
    indexUsed?: string;
    abTestID?: number;
    abTestVariantID?: number;
    parsedQuery?: string;
    userData?: any;
    appliedRules?: Array<Record<string, any>>;
    explain?: {
        match: {
            alternatives: Array<{
                types: string[];
                words: string[];
                typos: number;
                offset: number;
                length: number;
            }>;
        };
        params?: Record<string, any>;
    }
}
interface ResponseData {
    results: Result[]
}



const defaultQuery = {
    query: '',
    hitsPerPage: 10,
    page: 0,
    facets: []
}


const searchClient = algoliasearch(
    algolia.APPLICATION,
    algolia.SEARCH_ONLY_API_KEY
)


export default function Search({ visible, onCancel, onOk }) {
    const [query, setQuery] = useState(defaultQuery);
    const [response, setResponse] = useState<ResponseData>({ results: [] })
    const debouncedQuery = useDebounce(query, 500);

    const fetchSearchData = useCallback(async (params) => {
        const response = await searchClient.search([{
            indexName: algolia.ALGOLIA_INDEX,
            params
        }])
        setResponse(response)
    }, [])

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery({
            ...query,
            query: value
        })
    }

    useEffect(() => {
        if (debouncedQuery.query) {
            fetchSearchData(debouncedQuery);
        }
    }, [fetchSearchData, debouncedQuery])

    const { results } = response;
    const data: Result = results.length > 0 ? results[0] : undefined;
    return (
        <div className="site-search">
            <div className="algolia-popup popup search-popup" style={{ display: visible ? "block" : "none" }}>
                <div className="algolia-search">
                    <div className="algolia-search-input-icon">
                        <i className="fa fa-search"></i>
                    </div>
                    <div className="algolia-search-input" id="algolia-search-input">
                        <div className="ais-search-box">
                            <input
                                onChange={(e) => handleInputChange(e)}
                                autoCapitalize="off"
                                autoComplete="off"
                                autoCorrect="off"
                                placeholder="想要找些什么呢"
                                role="textbox"
                                spellCheck="false"
                                type="text"
                                value={query.query || ''}
                                className="ais-search-box--input" />
                        </div>
                    </div>
                </div>
                {
                    data &&
                    (
                        <div className="algolia-results">
                            <div id="algolia-stats">
                                <div className="ais-root ais-stats">
                                    <div className="ais-body ais-stats--body">
                                        <div>
                                            在 {data?.processingTimeMS} ms 查找了{data?.nbHits}个结果
                                            <span className="algolia-powered">
                                                <Image src="/images/algolia_logo.svg" alt="Algolia" height={18} width={68} />
                                            </span>
                                            <hr />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="algolia-hits">
                                <div className="ais-hits">
                                    {
                                        data?.hits.map(item => (
                                            <div className="ais-hits--item algolia-hit-item" key={item.slug}>
                                                <Link href={`/blog/${item.slug}`}>
                                                    <a
                                                        onClick={onOk}
                                                        className="algolia-hit-item-link"><em>{data?.query}</em>{item.title.substring(data?.query.length)}
                                                    </a>
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            {data.hits && data.hits.length > 0 &&
                                (
                                    <div id="algolia-pagination" className="algolia-pagination">
                                        <ul className="ais-pagination pagination">
                                            {
                                                data.page > 0 &&
                                                (
                                                    <li
                                                        onClick={() => setQuery({ ...query, page: query.page - 1 })}
                                                        className="ais-pagination--item pagination-item ais-pagination--item__previous">
                                                        <span className="ais-pagination--link page-number">
                                                            <i className="fa fa-angle-left"></i>
                                                        </span>
                                                    </li>
                                                )
                                            }
                                            {
                                                data?.nbPages && Array.from(Array(data?.nbPages).keys()).map(page => (
                                                    <li
                                                        onClick={() => setQuery({ ...query, page })}
                                                        key={page}
                                                        className={classNames("ais-pagination--item pagination-item ais-pagination--item__page", { "ais-pagination--item__active current": page === data?.page })} >
                                                        <a className="ais-pagination--link page-number" href="#">{page + 1}</a>
                                                    </li>
                                                ))
                                            }
                                            {
                                                data.page !== data.nbPages - 1 &&
                                                (
                                                    <li
                                                        className="ais-pagination--item pagination-item ais-pagination--item__next"
                                                        onClick={() => setQuery({ ...query, page: query.page + 1 })}
                                                    >
                                                        <a
                                                            className="ais-pagination--link page-number"
                                                            href="#">
                                                            <i className="fa fa-angle-right" />
                                                        </a>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </div>
                                )
                            }

                        </div>
                    )
                }

                <span className="popup-btn-close" onClick={onCancel}>
                    <i className="fa fa-times-circle"></i>
                </span>
            </div>
        </div>
    )
}