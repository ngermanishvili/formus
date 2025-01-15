// components/admin/BlockSelector.jsx
export const BlockSelector = ({
  blocks,
  selectedBlock,
  onSelect,
  onAddNew,
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Building2 className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-medium text-gray-700">აირჩიეთ კორპუსი</h2>
      </div>
      {selectedBlock && (
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          ახალი ბინის დამატება
        </Button>
      )}
    </div>
    <div className="flex flex-wrap gap-3">
      {blocks.map((block) => (
        <TooltipProvider key={block.block_id}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant={
                  selectedBlock === block.block_id ? "default" : "outline"
                }
                onClick={() => onSelect(block.block_id)}
                className="h-11"
              >
                {block.block_name}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>კორპუსი {block.block_name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  </div>
);
