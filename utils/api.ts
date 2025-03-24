import axios from "axios";

const BASE_URL = "http://localhost:4000";

export async function fetchWaitingList(date: string) {
  const res = await axios.get(`${BASE_URL}/waiting-list/${date}`);
  return res.data;
}

export async function getAllWaitingLists() {
  const res = await axios.get(`${BASE_URL}/waiting-list`);
  return res.data;
}

export async function markPuppyAsServiced(id: string, isServiced: boolean) {
  await axios.patch(`${BASE_URL}/puppy/${id}/mark-serviced`, {
    isServiced,
  });
}

export async function reorderPuppy(id: string, newPosition: number) {
  await axios.patch(`${BASE_URL}/puppy/${id}/reorder`, { newPosition });
}

export async function addPuppy(data: {
  waitingListId: string;
  ownerName: string;
  puppyName: string;
  serviceType: string;
}) {
  const res = await axios.post(`${BASE_URL}/puppy`, data);
  return res.data;
}

export async function createWaitingList(date: string) {
  const res = await axios.post(`${BASE_URL}/waiting-list`, { date });
  return res.data;
}

export async function fetchWaitingListById(id: string) {
    const res = await axios.get(`${BASE_URL}/waiting-list/by-id/${id}`);
    return res.data;
}