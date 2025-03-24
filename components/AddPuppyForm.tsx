"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPuppy, getAllWaitingLists } from "@/utils/api";
import { useState } from "react";

export default function AddPuppyForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    ownerName: "",
    puppyName: "",
    serviceType: "",
    waitingListId: "",
  });

  const { data: lists } = useQuery({
    queryKey: ["all-waiting-lists"],
    queryFn: getAllWaitingLists,
  });

  const mutation = useMutation({
    mutationFn: addPuppy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiting-list"] });
      setForm({ ownerName: "", puppyName: "", serviceType: "", waitingListId: "" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.ownerName || !form.puppyName || !form.serviceType || !form.waitingListId) return;
        mutation.mutate(form);
      }}
      className="space-y-4 w-full max-w-md p-4 border rounded-lg shadow"
    >
      <h2 className="text-lg font-semibold">Add New Puppy</h2>

      <input
        type="text"
        placeholder="Owner Name"
        value={form.ownerName}
        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Puppy Name"
        value={form.puppyName}
        onChange={(e) => setForm({ ...form, puppyName: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Service Type"
        value={form.serviceType}
        onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <select
        value={form.waitingListId}
        onChange={(e) => setForm({ ...form, waitingListId: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Waiting List</option>
        {lists?.map((list: any) => (
          <option key={list.id} value={list.id}>
            {list.date}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Puppy
      </button>
    </form>
  );
}
