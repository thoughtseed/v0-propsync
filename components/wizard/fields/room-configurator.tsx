"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"

export type RoomConfig = {
  name: string
  size: string
  type: string
}

interface RoomConfiguratorProps {
  value: RoomConfig[]
  onChange: (value: RoomConfig[]) => void
  rooms?: string[]
  options: {
    size: string[]
    type: string[]
  }
  maxRooms?: number
}

export function RoomConfigurator({
  value = [],
  onChange,
  rooms = ["Master", "Guest", "Living Room"],
  options,
  maxRooms = 10,
}: RoomConfiguratorProps) {
  const addRoom = () => {
    if (value.length < maxRooms) {
      onChange([...value, { name: rooms[0], size: options.size[0], type: options.type[0] }])
    }
  }

  const updateRoom = (index: number, field: keyof RoomConfig, fieldValue: string) => {
    const newRooms = [...value]
    newRooms[index] = { ...newRooms[index], [field]: fieldValue }
    onChange(newRooms)
  }

  const removeRoom = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {value.map((room, index) => (
          <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
            <Select value={room.name} onValueChange={(val) => updateRoom(index, "name", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((roomName) => (
                  <SelectItem key={roomName} value={roomName}>
                    {roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={room.size} onValueChange={(val) => updateRoom(index, "size", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {options.size.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={room.type} onValueChange={(val) => updateRoom(index, "type", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {options.type.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRoom(index)}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRoom}
        disabled={value.length >= maxRooms}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Room
      </Button>

      {value.length === 0 && (
        <p className="text-sm text-gray-500 text-center italic">No rooms configured yet. Click "Add Room" to start.</p>
      )}
    </div>
  )
}
