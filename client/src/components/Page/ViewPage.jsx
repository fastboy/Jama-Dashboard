import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from "react-helmet"
import useDynamicFilter from '../../hooks/useDynamicFilter';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { contentLoadingState, loginState } from '../../atoms';
import useCurrentRoute from '../../hooks/useCurrentRoute';
import ApiService from '../../utils/ApiService';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
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

            <Breadcrumb type="custom" pageTitle={pageTitle} showTitle={false} breadcrumbList={[{ "id": "1", "linkName": "Notes", "linkUrl": "/page" }]} />

            <div className='p-0 md:p-8'>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-title-md2">{pageTitle}</h2>
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
