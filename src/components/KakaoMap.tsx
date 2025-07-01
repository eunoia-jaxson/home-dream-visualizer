
import { useEffect, useRef } from "react";

interface KakaoMapProps {
  recommendations: Array<{
    name: string;
    coordinates?: { lat: number; lng: number };
  }>;
}

// Kakao Maps API 타입 선언
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => any;
        Map: new (container: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        LatLngBounds: new () => any;
        event: {
          addListener: (target: any, type: string, handler: () => void) => void;
        };
      };
    };
  }
}

const KakaoMap = ({ recommendations }: KakaoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // 카카오맵 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=sample&autoload=false';
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        initializeMap();
      });
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && recommendations.length > 0) {
      addMarkers();
    }
  }, [recommendations]);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
      level: 8
    };

    mapRef.current = new window.kakao.maps.Map(mapContainer.current, options);
  };

  const addMarkers = () => {
    if (!mapRef.current) return;

    // 기본 좌표 설정 (실제로는 API에서 받아와야 함)
    const regionCoordinates: Record<string, { lat: number; lng: number }> = {
      "성남시 분당구": { lat: 37.3595, lng: 127.1052 },
      "용인시 수지구": { lat: 37.3217, lng: 127.0928 },
      "인천시 연수구": { lat: 37.4106, lng: 126.6779 }
    };

    const bounds = new window.kakao.maps.LatLngBounds();

    recommendations.forEach((region) => {
      const coords = regionCoordinates[region.name];
      if (!coords) return;

      const position = new window.kakao.maps.LatLng(coords.lat, coords.lng);
      
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: position,
        map: mapRef.current
      });

      // 인포윈도우 생성
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;width:150px;text-align:center;">${region.name}</div>`
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(mapRef.current, marker);
      });

      bounds.extend(position);
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (recommendations.length > 0) {
      mapRef.current.setBounds(bounds);
    }
  };

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '300px' }}
    />
  );
};

export default KakaoMap;
