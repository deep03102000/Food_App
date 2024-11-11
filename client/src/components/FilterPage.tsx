import { useRestaurantStore } from "@/store/useRestaurantStore"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"

import { Label } from "./ui/label"

export type FilterOptionsState = {
    id: string,
    label: string
}
const filterOptions: FilterOptionsState[] = [
    { id: "indian", label: "Indian" },
    { id: "italian", label: "Italian" },
    { id: "chinese", label: "Chinese" },
    { id: "mexican", label: "Mexican" },
]

const FilterPage = () => {
    const { setAppliedFilter, appliedFilter, setResetFilter } = useRestaurantStore()
    const appliedFilterHandler = (value: string) => {
        setAppliedFilter(value)
    }
    return (
        <div className="md:w-72 md:ml-4">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-lg">Filter by Cuisines</h1>
                <Button onClick={setResetFilter} variant={"link"}>Reset</Button>
            </div>
            {filterOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 my-5">
                    <Checkbox
                        id={option.id}
                        checked ={appliedFilter.includes(option.label)}
                        onClick={() => appliedFilterHandler(option.label)}
                    />
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option.label}
                    </Label>
                </div>
            ))}


        </div>
    )
}

export default FilterPage