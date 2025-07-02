interface EncodedResponse {
  payload: string;
  encoding: 'base64' | 'gzip+base64';
  type: 'json';
}

class ResponseDecoder {
  static decode(response: any): any {
    // Check if response is encoded
    if (this.isEncodedResponse(response)) {
      return this.decodeResponse(response);
    }
    
    // Return original response if not encoded
    return response;
  }
  
  private static isEncodedResponse(response: any): response is EncodedResponse {
    return (
      typeof response === 'object' &&
      response !== null &&
      'payload' in response &&
      'encoding' in response &&
      'type' in response
    );
  }
  
  private static decodeResponse(response: EncodedResponse): any {
    try {
      switch (response.encoding) {
        case 'base64':
          return this.decodeBase64(response.payload);
        case 'gzip+base64':
          return this.decodeGzipBase64(response.payload);
        default:
          console.warn('Unknown encoding:', response.encoding);
          return response;
      }
    } catch (error) {
      console.error('Failed to decode response:', error);
      return response;
    }
  }
  
  private static decodeBase64(payload: string): any {
    try {
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Base64 decode error:', error);
      throw error;
    }
  }
  
  private static decodeGzipBase64(payload: string): any {
    try {
      // For browser compatibility, we'll use a simple base64 decode
      // In a real implementation, you'd use pako or similar for gzip decompression
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Gzip+Base64 decode error:', error);
      throw error;
    }
  }
}

// Enhanced fetch wrapper that automatically decodes responses
export async function decodedFetch(url: string, options?: RequestInit): Promise<Response> {
  const response = await fetch(url, options);
  
  if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
    const originalJson = response.json.bind(response);
    
    // Override the json() method to automatically decode
    response.json = async () => {
      const data = await originalJson();
      return ResponseDecoder.decode(data);
    };
  }
  
  return response;
}

export { ResponseDecoder }; 