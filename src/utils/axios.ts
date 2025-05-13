import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export class AxiosService {
  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(url, data, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async patch<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }
  async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.put(url, data, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete(url, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    throw new Error(error);
  }
}
