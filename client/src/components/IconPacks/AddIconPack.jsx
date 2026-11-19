import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { loadingState, loginState, reloadDashboardDataState } from '../../atoms';
import ApiService from '../../utils/ApiService';
import useDynamicFilter from '../../hooks/useDynamicFilter';
import NiceButton from '../NiceViews/NiceButton';
import NiceInput from '../NiceViews/NiceInput';
import makeToast from '../../utils/ToastUtils';
import NiceBack from '../NiceViews/NiceBack';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import useCurrentRoute from '../../hooks/useCurrentRoute';
import { useNavigate, useParams } from 'react-router-dom';

const AddIconPack = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const setActiveRoute = useCurrentRoute();

    const setLoading = useSetRecoilState(loadingState);
    const loginData = useRecoilValue(loginState);
    const setReloadData = useSetRecoilState(reloadDashboardDataState);

    const [iconpackUrl, setIconpackUrl] = useState('');

    useDynamicFilter(false);

    useEffect(() => {
        setActiveRoute("/manage/iconpack");
    }, [setActiveRoute]);

    useEffect(() => {
        if (!id) return;
        ApiService.get("/api/v1/iconpack/list", loginData?.token, navigate)
            .then((response) => {
                const iconPack = response?.message?.find((pack) => pack._id === id);
                if (iconPack) setIconpackUrl(iconPack.jsonUrl);
            })
            .catch(() => makeToast("error", "Failed to load icon pack"));
    }, [id, loginData?.token, navigate]);

    const saveSettings = () => {
        //validate data
        if (!iconpackUrl) {
            return makeToast("warning", "Icon pack URL is required");
        }

        if (!iconpackUrl.toLowerCase()?.startsWith('https://') || !iconpackUrl.toLowerCase()?.endsWith('.json')) {
            makeToast("error", "Please enter a valid URL.");
            return;
        }

        //send data to save
        setLoading(true);
        const endpoint = id ? `/api/v1/iconpack/update/${id}` : "/api/v1/iconpack/add";
        ApiService.post(endpoint, { iconpackUrl }, loginData?.token, navigate)
            .then(() => {
                makeToast("success", id ? "Icon pack updated successfully." : "Icon pack added successfully.");
                setIconpackUrl('');
                setReloadData(true);
                navigate("/manage/iconpack");
            })
            .catch((error) => {
                if (!error.handled) makeToast("error", error.response?.data?.message || "Failed to add icon pack");
            }).finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <Helmet>
                <title>{id ? "Edit Icon Pack" : "Add Icon Pack"}</title>
            </Helmet>

            <Breadcrumb type="custom" pageTitle={id ? "Edit Icon Pack" : "Add Icon Pack"} breadcrumbList={[{ "id": "1", "linkName": "Settings", "linkUrl": "/manage" }, { "id": "2", "linkName": "Icon Packs", "linkUrl": "/manage/iconpack" }]} />

            <div className="max-w-4xl mx-auto w-full">
                <div className="card border bg-cardBg text-cardText border-cardBorder shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
                    <div className="mt-4">
                        <NiceInput
                            label="Icon Pack URL"
                            value={iconpackUrl}
                            className='border bg-inputBg border-inputBorder text-inputText placeholder-inputPlaceholder'
                            onChange={(e) => setIconpackUrl(e.target.value)}
                            placeholder="https://example.com/icon-pack.json"
                        />

                    </div>
                    <div className="flex justify-end mt-4">
                        <NiceBack />

                        <NiceButton
                            label={id ? "Save" : "Add"}
                            className="bg-buttonSuccess text-buttonText"
                            onClick={saveSettings}
                        />

                    </div>
                    <div className="mt-4">
                        <h2>To get icon packs:</h2>
                        <div className="text-xs mt-4">
                            Icon packs can be hosted at any trusted HTTPS URL ending in `.json`.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const MemoizedComponent = React.memo(AddIconPack);
export default MemoizedComponent;
