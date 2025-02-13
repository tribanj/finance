import { DataGrid } from '@mui/x-data-grid';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const Applications = () => {
  const [value, loading] = useCollection(query(collection(db, 'applications')));

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'userId', headerName: 'User ID', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'tenure', headerName: 'Tenure (months)', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          params.value === 'approved' ? 'bg-green-100 text-green-800' :
          params.value === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {params.value}
        </span>
      )
    },
    { field: 'appliedAt', headerName: 'Applied At', width: 200 },
  ];

  const rows = value?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];

  return (
    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Loan Applications</h1>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Applications;