import React, { memo, useState } from "react";

import { Handle } from "react-flow-renderer";
import { Select } from "antd";

export default memo(({ id, data, isConnectable }) => {
	const [cameraList, setCameraList] = useState([
		{ key: 1, camera_name: "kamera1" },
		{ key: 2, camera_name: "kamera2" },
	]);

	return (
		<div style={{ width: 120, height: 40 }}>
			<div style={{ marginBottom: 5, marginTop: 5 }}>Camera</div>
			<select
				value={data.selectedCamera}
				onChange={(event) => data.onChange(event, "selectedCamera", id)}
				placeholder="Lütfen Kamera İsmi Seçiniz"
				style={{ width: "90%" }}
			>
				{cameraList.map((element) => {
					return (
						<option key={element.key} value={element.camera_name}>
							{element.camera_name}
						</option>
					);
				})}
			</select>

			<Handle type="source" position="right" id="b" style={{ background: "#555" }} isConnectable={isConnectable} />
		</div>
	);
});
