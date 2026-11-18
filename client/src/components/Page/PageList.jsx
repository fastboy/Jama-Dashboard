import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import { GiNotebook } from "react-icons/gi";
import ApiService from '../../utils/ApiService';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { changedPageState, deletePageModalState, loadingState, loginState } from '../../atoms';
import DeletePageModal from '../Modals/DeletePageModal';
import useDynamicFilter from '../../hooks/useDynamicFilter';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import useCurrentRoute from '../../hooks/useCurrentRoute';

import SinglePageItem from './SinglePageItem';
import NoListing from '../Misc/NoListing';
import makeToast from '../../utils/ToastUtils';
import NiceLink from '../NiceViews/NiceLink';
import { useLocation, useNavigate } from 'react-router-dom';

const PageList = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [pageList, setPageList] = useState([]);

  const setLoading = useSetRecoilState(loadingState);
  const loginData = useRecoilValue(loginState);

  const setPageDelete = useSetRecoilState(deletePageModalState);

  const [changedPage, setChangedPage] = useRecoilState(changedPageState);

  useDynamicFilter(false);
  useCurrentRoute(location.pathname.startsWith('/manage') ? "/manage/page" : "/page");

  useEffect(() => {
    setLoading(true);
    ApiService.get("/api/v1/page/list", loginData?.token, navigate)
      .then(data => {
        setPageList(data?.message);
      })
      .catch((error) => {
        if (!error.handled) makeToast("error", "Error loading data...");
      }).finally(() => {
        setLoading(false);
      });
  }, [loginData?.token, setLoading, changedPage, navigate]);

  useEffect(() => {
    setChangedPage(null);
  });


  const deletePage = (pageId) => {
    setPageDelete({ isOpen: true, data: { pageId } });
  }


  return (
    <>
      <DeletePageModal />

      <Helmet>
        <title>Notes</title>
      </Helmet>

      <Breadcrumb type="custom" pageTitle={"Notes"} breadcrumbList={[{ "id": "1", "linkName": "Dashboard", "linkUrl": "/" }]} />

      <div className="flex flex-col justify-between">
        <div className="text-left w-full md:w-auto" />
        <div className="flex flex-wrap justify-end space-x-2 mt-4 md:mt-0">
          <NiceLink label="Add Note"
            className="bg-buttonGeneric text-buttonText"
            to="/manage/page/add" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full mt-4"
      >
        <div className="space-y-4 w-full">
          {pageList?.length > 0 ? (
            <>
              {
                pageList.map(page => (
                  <SinglePageItem key={page._id} page={page} deletePage={deletePage} />
                ))
              }
            </>
          ) : (
            <NoListing mainText="No notes yet" subText="Create your first note" buttonText="Go to dashboard" buttonLink="/" displayIcon={<GiNotebook />} />
          )}
        </div>
      </motion.div>
    </>
  );
};

const MemoizedComponent = React.memo(PageList);
export default MemoizedComponent;