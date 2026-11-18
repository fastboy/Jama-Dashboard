import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from "react-helmet"
import useDynamicFilter from '../../hooks/useDynamicFilter';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { contentLoadingState, loginState } from '../../atoms';
import useCurrentRoute from '../../hooks/useCurrentRoute';
import ApiService from '../../utils/ApiService';
import NiceLink from '../NiceViews/NiceLink';
import './ViewPage.css'


const ViewPage = () => {
    const params = useParams();

    const pageId = params?.pageId;

    const navigate = useNavigate();
    const loginData = useRecoilValue(loginState);
    const setLoading = useSetRecoilState(contentLoadingState);

    const [pageTitle, setPageTitle] = useState("");
    const [pageContent, setPageContent] = useState("");

    useDynamicFilter(false);
    useCurrentRoute("/page");

    //fetch details by pageId
    useEffect(() => {
        if (pageId) {
            setLoading(true);
            ApiService.get(`/api/v1/page/info/${pageId}`, loginData?.token, navigate)
                .then(data => {
                    if (data?.message) {
                        setPageTitle(data?.message?.pageTitle);
                        setPageContent(data?.message?.pageContent);
                    } else {
                        setPageTitle("");
                        setPageContent("");
                    }
                })
                .catch((error) => {
                    if (!error.handled) navigate("/");
                }).finally(() => {
                    setLoading(false);
                });
        } else {
            navigate("/");
        }
    }, [pageId, loginData?.token, navigate, setLoading]);

    return (
        <>
            <Helmet>
                <title>{pageTitle} </title>
            </Helmet>

            <div className='p-0 md:p-8'>
                <div className="page-view-toolbar sticky top-0 z-20 -mx-0 md:-mx-8 mb-6 flex flex-wrap items-center justify-between gap-3 border-b bg-bodyBg px-0 py-3 md:px-8">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex flex-wrap items-center gap-2">
                            <li>
                                <Link className="font-medium text-breadcrumbText" to="/page">Notes /</Link>
                            </li>
                            <li className="font-medium text-breadcrumbLinkText">{pageTitle}</li>
                        </ol>
                    </nav>
                    <div className="flex gap-2">
                        <NiceLink label="Edit" className="bg-buttonSuccess text-buttonText" to={`/manage/page/${pageId}`} />
                        <NiceLink label="Back to Notes" className="bg-buttonDanger text-buttonText" to="/page" />
                    </div>
                </div>
                <div className='page-content-area'>
                    {/* skipcq: JS-0440 */}
                    <div className="mt-6 mb-6" dangerouslySetInnerHTML={{ __html: pageContent || '' }} />
                </div>
            </div>
        </>
    );
};

const MemoizedComponent = React.memo(ViewPage);
export default MemoizedComponent;
