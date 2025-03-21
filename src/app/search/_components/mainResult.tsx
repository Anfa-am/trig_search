import {ImageSection} from './imageSection';
import {RelatedPills} from './relatedPills';
import {RoleDescription} from './roleDescription';

export function MainResult({ resultName, relatedMatches }: { resultName: string, relatedMatches: string[] }) {
  return (<div className="flex flex-row gap-4 p-10 smaller:flex-col smaller:p-2">
    <div className="w-[50vw] smaller:w-full">
      <h1 className="text-4xl">{resultName}</h1>
      <RoleDescription jobTitle={resultName} ></RoleDescription>
      <div className="mt-10">
        <span className="font-bold mb-5 text-sm"> simillar jobs:</span>
        <RelatedPills relatedMatches={relatedMatches}></RelatedPills>
      </div>
    </div>

    <div className="w-[50vw] smaller:w-full smaller:mb-10">
      <ImageSection imageQuery={resultName} />
    </div>
  </div>);
}
