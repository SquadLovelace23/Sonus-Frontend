export const uploadRequest = async (file: File | undefined): Promise<string | undefined> => {
    try {
      const { VITE_API_URL: url } = import.meta.env;
      const formData: FormData = new FormData();
      file && formData.append('image', file);
  
      const response: Response = await fetch(`${url}/cloudinary/image`, {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
  
      if (data && data.data && data.data.url) {
        return data.data.url;
      } else {
        console.error('Invalid response format from server:', data);
        return undefined;
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return undefined;
    }
};
  