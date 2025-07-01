import { useEffect, useState } from 'react';

interface GoogleMapProps {
  recommendations: Array<{
    name: string;
    coordinates?: { lat: number; lng: number };
  }>;
}

const GoogleMap = ({ recommendations }: GoogleMapProps) => {
  const [mapUrl, setMapUrl] = useState<string>('');

  useEffect(() => {
    if (recommendations.length > 0) {
      generateMapUrl();
    }
  }, [recommendations]);

  const generateMapUrl = () => {
    // 첫 번째 추천 지역을 중심으로 지도 생성
    const centerRegion = recommendations[0];
    const regionCoordinates: Record<string, { lat: number; lng: number }> = {
      '성남시 분당구': { lat: 37.3595, lng: 127.1052 },
      '용인시 수지구': { lat: 37.3217, lng: 127.0928 },
      '인천시 연수구': { lat: 37.4106, lng: 126.6779 },
    };

    const coords = regionCoordinates[centerRegion.name] || {
      lat: 37.5665,
      lng: 126.978,
    };

    // 모든 추천 지역의 마커를 위한 쿼리 생성
    const markers = recommendations
      .map((region) => {
        const regionCoords = regionCoordinates[region.name];
        if (regionCoords) {
          return `${regionCoords.lat},${regionCoords.lng}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('|');

    // Google Maps Embed API URL 생성 (API 키 불필요)
    const baseUrl = 'https://www.google.com/maps/embed/v1/place';
    const query = encodeURIComponent(centerRegion.name);

    // iframe용 URL (API 키 없이 사용 가능)
    const iframeUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12614.035896748374!2d${coords.lng}!3d${coords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sko!2skr!4v1635000000000!5m2!1sko!2skr`;

    setMapUrl(iframeUrl);
  };

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '300px' }}
    >
      {mapUrl ? (
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '300px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="추천 지역 지도"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
            <p className="text-gray-600">지도를 로딩중입니다...</p>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          📍 표시된 위치: {recommendations.map((r) => r.name).join(', ')}
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
