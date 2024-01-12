import {
  ApartmentSharingLink,
  ApartmentSharingLinks,
} from "df-shared-next/src/models/ApartmentSharingLink";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const LINKS_API_URL = `${API_URL}/api/application/links`;

export const ApartmentSharingLinkService = {
  getLinks() {
    return axios.get<ApartmentSharingLinks>(LINKS_API_URL);
  },
  deleteLink(link: ApartmentSharingLink) {
    return axios.delete(`${LINKS_API_URL}/${link.id}`);
  },
  updateLinkStatus(link: ApartmentSharingLink, enabled: boolean) {
    return axios.put(`${LINKS_API_URL}/${link.id}?enabled=${enabled}`);
  },
};
