import {useEffect, useState} from "react";
const { kakao } = window;

export default function KakaoMap({address}) {
    const[position,setPosition]=useState(null)
    useEffect(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const position = { lat: 33.450701, lng: 126.570667 };
        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const { x, y } = result[0];
                setPosition({lat:parseFloat(y),lng:parseFloat(x)})
            } else {
                console.error("주소 검색 실패:", status);
            }
        });
    }, [])

    useEffect(() => {
        if(!position) return;
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(position.lat, position.lng),
            level: 3
        };
        const map = new kakao.maps.Map(container, options);
        map.setDraggable(false);
        map.setZoomable(false);
    }, [position])

    return (
        <div id="map" style={{ width: '500px', height: '500px' }}></div>
    )
}
