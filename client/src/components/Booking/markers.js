import L from "leaflet"

export const pickUpIcon = new L.DivIcon({
        html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22))">
      
      <div style="
        background:#0a0a0a;
        color:#fff;
        padding:5px 14px;
        border-radius:100px;
        font-size:10px;
        font-weight:800;
        letter-spacing:0.14em;
        text-transform:uppercase;
        white-space:nowrap;
        font-family:-apple-system,system-ui,sans-serif;
        box-shadow:0 2px 12px rgba(0,0,0,0.25);
      ">
        PICKUP
      </div>
  
      <div style="
        width:2px;
        height:10px;
        background:#0a0a0a;
        opacity:0.4;
      "></div>
  
      <div style="
        width:13px;
        height:13px;
        background:#0a0a0a;
        border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);
      "></div>
  
    </div>`,
        className: "",
        iconSize: [90, 55],
        iconAnchor: [45, 58],
    });

export const dropIcon = new L.DivIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22))">
      
      <div style="
        background:#0a0a0a;
        color:#fff;
        padding:5px 14px;
        border-radius:100px;
        font-size:10px;
        font-weight:800;
        letter-spacing:0.14em;
        text-transform:uppercase;
        white-space:nowrap;
        font-family:-apple-system,system-ui,sans-serif;
        box-shadow:0 2px 12px rgba(0,0,0,0.25);
      ">
        DROP
      </div>
  
      <div style="
        width:2px;
        height:10px;
        background:#0a0a0a;
        opacity:0.4;
      "></div>
  
      <div style="
        width:13px;
        height:13px;
        background:#0a0a0a;
        border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);
      "></div>
  
    </div>`,
    className: "",
    iconSize: [90, 55],
    iconAnchor: [45, 58],
});