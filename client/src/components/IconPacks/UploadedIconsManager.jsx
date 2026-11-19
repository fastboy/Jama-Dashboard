import React, { useCallback, useEffect, useState } from 'react';
import { FiTrash } from 'react-icons/fi';
import { useRecoilValue } from 'recoil';
import { loginState } from '../../atoms';
import ApiService from '../../utils/ApiService';
import ImageView from '../Misc/ImageView';
import NiceLoader from '../NiceViews/NiceLoader';
import makeToast from '../../utils/ToastUtils';
import { useNavigate } from 'react-router-dom';

const UploadedIconsManager = () => {
  const navigate = useNavigate();
  const loginData = useRecoilValue(loginState);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIcons = useCallback(() => {
    if (!loginData?.token) return;
    setLoading(true);
    ApiService.get('/api/v1/images?page=1', loginData.token, navigate)
      .then((response) => setIcons((response?.data || []).filter((icon) => icon.userId)))
      .catch((error) => {
        if (!error.handled) makeToast('error', 'Cannot load uploaded icons.');
      })
      .finally(() => setLoading(false));
  }, [loginData?.token, navigate]);

  useEffect(() => {
    fetchIcons();
  }, [fetchIcons]);

  const deleteIcon = (icon) => {
    if (!window.confirm('Delete this uploaded icon?')) return;
    ApiService.get(`/api/v1/images/delete/${icon._id}`, loginData?.token, navigate)
      .then(() => {
        setIcons((current) => current.filter((item) => item._id !== icon._id));
        makeToast('success', 'Icon deleted.');
      })
      .catch((error) => {
        if (!error.handled) makeToast('error', 'Cannot delete icon.');
      });
  };

  return (
    <section className="mt-8 border-t border-cardBorder pt-6">
      <h2 className="text-title-md2">Uploaded Icons</h2>
      <p className="mt-1 mb-4 text-sm opacity-75">Icons uploaded from the icon selector. They can be deleted here.</p>
      {loading ? <NiceLoader className="text-loaderColor" /> : icons.length === 0 ? (
        <p className="text-sm opacity-75">No uploaded icons.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {icons.map((icon) => (
            <div key={icon._id} className="relative flex flex-col items-center rounded-lg border border-cardBorder bg-cardBg p-3">
              <button
                type="button"
                title="Delete uploaded icon"
                onClick={() => deleteIcon(icon)}
                className="absolute right-1 top-1 rounded-full bg-buttonDanger p-1 text-buttonText"
              >
                <FiTrash size={13} />
              </button>
              <div className="h-16 w-16">
                <ImageView src={icon.iconPath} alt="Uploaded icon" className="h-full w-full object-contain" defaultSrc="/default.png" />
              </div>
              <span className="mt-2 max-w-full truncate text-xs">{icon.iconPath}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default React.memo(UploadedIconsManager);
