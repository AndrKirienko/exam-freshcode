import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CreatorDashboard from '../../components/CreatorDashboard/CreatorDashboard';
import CustomerDashboard from '../../components/CustomerDashboard/CustomerDashboard';
import NotFound from '../../components/NotFound/NotFound';
import CONSTANTS from '../../constants';

const { CUSTOMER, CREATOR } = CONSTANTS;

const Dashboard = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { role } = useSelector(state => state.userStore.data);
  return (
    <>
      {(() => {
        switch (role) {
          case CUSTOMER:
            return <CustomerDashboard navigate={navigate} params={params} />;
          case CREATOR:
            return <CreatorDashboard navigate={navigate} params={params} />;
          default:
            return <NotFound />;
        }
      })()}
    </>
  );
};

export default Dashboard;
