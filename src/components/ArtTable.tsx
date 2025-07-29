import React, { useEffect, useState } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';
import { Artwork } from '../types/artwork';

const ArtTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const pageSize = 10;

  const fetchArtworks = async (page: number) => {
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page + 1}&limit=${pageSize}`
      );
      setArtworks(response.data.data);
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  const handlePageChange = (e: DataTablePageEvent) => {
    setPage(e.page);
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  const handleSelect = (id: number) => {
    setSelectedIds((prevSelected) =>
      isSelected(id)
        ? prevSelected.filter((i) => i !== id)
        : [...prevSelected, id]
    );
  };

  const checkboxBody = (rowData: Artwork) => (
    <Checkbox
      checked={isSelected(rowData.id)}
      onChange={() => handleSelect(rowData.id)}
    />
  );

  return (
    <DataTable
      value={artworks}
      paginator
      rows={pageSize}
      totalRecords={totalRecords}
      lazy
      first={page * pageSize}
      onPage={handlePageChange}
    >
      <Column body={checkboxBody} header="Select" />
      <Column field="id" header="ID" />
      <Column field="title" header="Title" />
      <Column field="artist_display" header="Artist" />
      <Column field="date_display" header="Date" />
    </DataTable>
  );
};

export default ArtTable;
