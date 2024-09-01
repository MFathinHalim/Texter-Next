function Loading({ loading }: any) {
  const loadingClass = loading ? "d-block" : "d-none";
  return (
    <div id='loading-screen-bottom' className={`card border-light rounded-0 bg-dark post d-flex align-items-center justify-content-center text-center mt-0 pt-3 pb-3 ${loadingClass}`}>
      <div id='spinner-d' className='spinner-border text-primary' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
