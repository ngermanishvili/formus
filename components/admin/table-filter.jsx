// components/admin/ApartmentTable/TableFilters.jsx
export const TableFilters = ({
  searchTerm,
  onSearchChange,
  filterFloor,
  onFilterChange,
  floors,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <SearchFilter value={searchTerm} onChange={onSearchChange} />
    <FloorFilter
      value={filterFloor}
      onChange={onFilterChange}
      floors={floors}
    />
  </div>
);
