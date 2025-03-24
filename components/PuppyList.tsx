"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchWaitingListById,
  getAllWaitingLists,
  markPuppyAsServiced,
  reorderPuppy,
  addPuppy,
  createWaitingList,
  searchPuppies,
} from "@/utils/api";
import { useEffect, useState, useRef, useMemo } from "react";
import PuppyCard from "./PuppyCard";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Puppy {
  id: string;
  puppyName: string;
  ownerName: string;
  serviceType: string;
  position: number;
  isServiced: boolean;
  arrivalTime: string;
}

function DraggablePuppy({ puppy, index, movePuppy, onMarkServiced }: {
  puppy: Puppy;
  index: number;
  movePuppy: (dragIndex: number, hoverIndex: number) => void;
  onMarkServiced: (id: string, isServiced: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "puppy",
    hover(item: any) {
      if (item.index === index) return;
      movePuppy(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "puppy",
    item: { id: puppy.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <PuppyCard
        puppy={puppy}
        onMarkServiced={() => onMarkServiced(puppy.id, !puppy.isServiced)}
      />
    </div>
  );
}

export default function PuppyList() {
  const queryClient = useQueryClient();
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [filterServiced, setFilterServiced] = useState<string>("all");
  const [sortByTime, setSortByTime] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState({
    ownerName: "",
    puppyName: "",
    serviceType: "",
    arrivalTime: "",
    waitingListId: "",
  });

  const { data: allLists = [] } = useQuery({
    queryKey: ["all-waiting-lists"],
    queryFn: getAllWaitingLists,
  });

  const { data } = useQuery({
    queryKey: ["waiting-list", selectedListId],
    queryFn: () => fetchWaitingListById(selectedListId),
    enabled: !!selectedListId,
  });

  const { data: searchResults } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => searchPuppies(searchTerm),
    enabled: searchTerm.length > 1,
  });

  useEffect(() => {
    const found = allLists.find((l: any) => l.date === selectedDate);
    if (found) setSelectedListId(found.id);
    else setSelectedListId("");
  }, [selectedDate, allLists]);

  useEffect(() => {
    if (data?.puppies) {
      let sorted = [...data.puppies];
      if (sortByTime) {
        sorted = sorted.sort((a, b) => new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime());
      } else {
        sorted = sorted.sort((a, b) => a.position - b.position);
      }
      setPuppies(sorted);
    }
  }, [data, sortByTime]);

  const reorderMutation = useMutation({
    mutationFn: ({ id, newPosition }: { id: string; newPosition: number }) => reorderPuppy(id, newPosition),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["waiting-list", selectedListId] }),
  });

  const markMutation = useMutation({
    mutationFn: ({ id, isServiced }: { id: string; isServiced: boolean }) =>
      markPuppyAsServiced(id, isServiced),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["waiting-list", selectedListId] }),
  });

  const addPuppyMutation = useMutation({
    mutationFn: addPuppy,
    onSuccess: () => {
      queryClient.invalidateQueries();
      setFormData({ ownerName: "", puppyName: "", serviceType: "", arrivalTime: "", waitingListId: "" });
    },
  });

  const createListMutation = useMutation({
    mutationFn: createWaitingList,
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const movePuppy = (dragIndex: number, hoverIndex: number) => {
    const updated = [...puppies];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    setPuppies(updated);
    reorderMutation.mutate({ id: removed.id, newPosition: hoverIndex + 1 });
  };

  const filteredPuppies = useMemo(() => {
    let result = [...puppies];
    if (filterServiced !== "all") {
      result = result.filter((p) => p.isServiced === (filterServiced === "serviced"));
    }
    return result;
  }, [puppies, filterServiced]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">🐶 Waiting List Manager</h2>

        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded shadow"
          />
          <button
            onClick={() => createListMutation.mutate(selectedDate)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Create List
          </button>

          <select
            className="p-2 border rounded"
            onChange={(e) => setFilterServiced(e.target.value)}
            value={filterServiced}
          >
            <option value="all">All</option>
            <option value="serviced">Serviced</option>
            <option value="waiting">Waiting</option>
          </select>

          <button
            onClick={() => setSortByTime((prev) => !prev)}
            className="px-3 py-1 border rounded text-sm text-blue-700 border-blue-400 hover:bg-blue-100"
          >
            Sort by Time
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Search puppy history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {searchTerm.length > 1 && searchResults?.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-lg font-semibold">🔍 Search Results</h4>
            {searchResults.map((puppy: Puppy) => (
              <PuppyCard key={puppy.id} puppy={puppy} onMarkServiced={() => {}} />
            ))}
          </div>
        )}

        <div className="border p-4 rounded bg-white shadow">
          <h3 className="text-lg font-semibold mb-3">➕ Add New Puppy</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Owner Name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Puppy Name"
              value={formData.puppyName}
              onChange={(e) => setFormData({ ...formData, puppyName: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Service Type"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="datetime-local"
              value={formData.arrivalTime}
              onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={formData.waitingListId}
              onChange={(e) => setFormData({ ...formData, waitingListId: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="">Select Waiting List</option>
              {allLists?.map((list: any) => (
                <option key={list.id} value={list.id}>
                  {list.date}
                </option>
              ))}
            </select>
            <button
              onClick={() => addPuppyMutation.mutate(formData)}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={
                !formData.ownerName ||
                !formData.puppyName ||
                !formData.serviceType ||
                !formData.arrivalTime ||
                !formData.waitingListId
              }
            >
              Add to List
            </button>
          </div>
        </div>

        {!selectedListId ? (
          <p className="text-gray-500">Please select a date with an existing waiting list.</p>
        ) : !filteredPuppies.length ? (
          <p className="text-gray-500">No puppies found for {selectedDate}.</p>
        ) : (
          filteredPuppies.map((puppy, index) => (
            <DraggablePuppy
              key={puppy.id}
              puppy={puppy}
              index={index}
              movePuppy={movePuppy}
              onMarkServiced={(id, isServiced) => markMutation.mutate({ id, isServiced })}
            />
          ))
        )}
      </div>
    </DndProvider>
  );
}