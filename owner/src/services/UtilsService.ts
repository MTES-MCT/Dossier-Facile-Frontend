import axios from 'axios';
import { Property } from 'df-shared-next/src/models/Property';
import Applicant from '../components/property/Applicant';

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`;

const UtilsService = {
  isMobile() {
    return window.innerWidth < 768;
  },
  capitalize(w: string) {
    const word = w[0].toUpperCase() + w.slice(1).toLowerCase();
    return word.replace(/([' -][A-Za-zÀ-ÖØ-öø-ÿ])/g, (s) => s.toUpperCase());
  },
  getAddresses(label: string) {
    return axios.get(`${API_URL}property/listAddresses/${label}`);
  },
  getTenants(p: Property): Applicant[] {
    if (!p.propertiesApartmentSharing) {
      return [];
    }

    return p.propertiesApartmentSharing.map((pas: any) => {
      const a = pas.apartmentSharing;
      if (a !== undefined && a.tenants.length > 0) {
        const rate = a.totalSalary > 0 ? Math.round((p.rentCost / a.totalSalary) * 100) : '100';
        const mainTenant = a.tenants.find((t: Applicant) => t.tenantType === 'CREATE');
        return {
          id: pas.id,
          lastUpdateDate: new Date(mainTenant.lastUpdateDate),
          tenantName: `${mainTenant.lastName} ${mainTenant.firstName}`,
          tenantType: a.applicationType,
          tenantSalary: `${a.totalSalary} €`,
          guarantorSalary: a.totalGuarantorSalary ? `${a.totalGuarantorSalary} €` : '-',
          rate: `${rate}`,
          status: mainTenant.status,
          token: a.token,
        };
      }
      return {};
    });
  },
};

export default UtilsService;
