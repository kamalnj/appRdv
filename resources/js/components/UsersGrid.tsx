import DataGrid, {
  Column,
  Paging,
  Pager,
  FilterRow,
} from "devextreme-react/data-grid";

type Computers = {
  id: number;
  name: string;
  serial?: string | null;
  contact?: string | null;
  entity_id?: number | null;
};

type ComputersGridProps = {
  computers: Computers[];
};

export default function ComputersGrid({ computers }: ComputersGridProps) {
  return (
    <DataGrid<Computers>
      dataSource={computers}
      keyExpr="id"
      showBorders={true}
    >
      <FilterRow visible />
      <Paging defaultPageSize={5} />
      <Pager showPageSizeSelector={false} showInfo />

      <Column dataField="name" caption="Nom" />
      <Column dataField="serial" caption="Serial" />
      <Column dataField="contact" caption="Contact" />
      <Column dataField="last_inventory_update" caption="Dernière MAJ inventaire" />
    </DataGrid>
  );
}
