import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";

type ColumnVisibility = {
  goals: boolean;
  percentage: boolean;
};
type MatchConfigurationProps = {
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
  showOnlyMatchPercentage: boolean;
  onShowOnlyMatchPercentageChange:
    | ((showOnlyMatchPercentage: boolean) => void)
    | undefined;
  matchNumber: number;
};

export function MatchConfiguration({
  columnVisibility,
  onColumnVisibilityChange,
  showOnlyMatchPercentage,
  onShowOnlyMatchPercentageChange,
  matchNumber,
}: MatchConfigurationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-start items-center gap-2 bg-green-800 rounded-lg p-2 hover:bg-green-700 transition-colors"
      >
        <IoSettingsOutline className="w-5 h-5 text-green-200" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-green-800 rounded-lg shadow-lg p-4 space-y-4 z-10">
          {/* Column Visibility */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-200 mb-2">
              Mostrar columnas
            </h3>
            <label className="flex items-center justify-between">
              <span className="text-sm text-green-200">Goles</span>
              <button
                onClick={() =>
                  onColumnVisibilityChange({
                    ...columnVisibility,
                    goals: !columnVisibility.goals,
                  })
                }
                className={`
                    relative inline-flex h-6 w-11 
                    items-center rounded-full 
                    ${columnVisibility.goals ? "bg-green-600" : "bg-gray-600"}
                    transition-colors duration-200
                  `}
              >
                <span
                  className={`
                      absolute inline-block h-4 w-4 
                      transform rounded-full bg-white
                      transition-transform duration-200
                      ${
                        columnVisibility.goals
                          ? "translate-x-6"
                          : "translate-x-1"
                      }
                    `}
                />
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-green-200">Porcentaje</span>
              <button
                onClick={() =>
                  onColumnVisibilityChange({
                    ...columnVisibility,
                    percentage: !columnVisibility.percentage,
                  })
                }
                className={`
                    relative inline-flex h-6 w-11 
                    items-center rounded-full 
                    ${
                      columnVisibility.percentage
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }
                    transition-colors duration-200
                  `}
              >
                <span
                  className={`
                      absolute inline-block h-4 w-4 
                      transform rounded-full bg-white
                      transition-transform duration-200
                      ${
                        columnVisibility.percentage
                          ? "translate-x-6"
                          : "translate-x-1"
                      }
                    `}
                />
              </button>
            </label>
          </div>

          {/* Percentage Type */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-200 mb-2">
              Tipo de porcentaje
            </h3>
            <label className="flex items-center justify-between">
              <span className="text-sm text-green-200">
                %{" "}
                {showOnlyMatchPercentage ? `Previo F${matchNumber}` : "Actual"}
              </span>
              <button
                onClick={() =>
                  onShowOnlyMatchPercentageChange &&
                  onShowOnlyMatchPercentageChange(!showOnlyMatchPercentage)
                }
                className={`
                    relative inline-flex h-6 w-11 
                    items-center rounded-full 
                    ${showOnlyMatchPercentage ? "bg-green-600" : "bg-gray-600"}
                    transition-colors duration-200
                  `}
              >
                <span
                  className={`
                      absolute inline-block h-4 w-4 
                      transform rounded-full bg-white
                      transition-transform duration-200
                      ${
                        showOnlyMatchPercentage
                          ? "translate-x-6"
                          : "translate-x-1"
                      }
                    `}
                />
              </button>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
