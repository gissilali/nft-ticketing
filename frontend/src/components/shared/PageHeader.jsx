export const PageHeader = ({ title }) => {
  return (
    <>
      <h1
        className={"font-semibold mt-3 text-3xl  tracking-tight text-slate-900"}
      >
        {title}
      </h1>
      <hr className={"my-4"} />
    </>
  );
};
