import React from 'react';

const Member: React.FC = () => {
  const [times, setTimes] = React.useState(0);
  return (
    <>
      <div style={{ fontSize: '1.5em', margin: '0 auto', marginBottom: 20 }}>Team Member</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '0 auto',
          marginBottom: 20,
          height: 200,
        }}
        onClick={() => setTimes(times + 1)}
      >
        {times > 5 ? (
          <img
            key="1"
            style={{ height: '100%' }}
            src="https://bitflow-frontend-deploy.s3.ap-southeast-2.amazonaws.com/5581734599729_.pic_hd.jpg"
          ></img>
        ) : (
          <img
            key="2"
            style={{ height: '100%', margin: '0 auto' }}
            src={`${window.ENV?.REACT_APP_IMG_URL}/image/bitflow+icon.png`}
          />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', lineHeight: 2 }}>
        Product Designer: Ziyi Wang <br />
        Front-end Architect: Rita Wang <br />
        Front-end Developer: Rita Wang, Ziyi Wang <br />
        Back-end Architect and Developer: Xinyi Ding <br />
        DevOps Engineer: Xinyi Ding <br />
        Project Manager: Ziyi Wang <br />
        Test Engineer: Ziyi Wang <br />
        Data Engineer: Sean Sheng
        <br />
        Algorithm Engineer: Sean Sheng
        <br />
      </div>
    </>
  );
};
export default Member;
