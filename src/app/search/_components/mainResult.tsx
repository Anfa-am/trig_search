import {ImageSection} from './imageSection';
import {RelatedPills} from './relatedPills';
import {RoleDescription} from './roleDescription';

export function MainResult({ resultName, relatedMatches }: { resultName: string, relatedMatches: string[] }) {
  return (<div className="flex flex-row gap-4 p-10">
    <div className="w-[50vw]" >
      <h1 className="text-4xl">{resultName}</h1>
      <RoleDescription jobTitle={resultName} ></RoleDescription>
      <RelatedPills relatedMatches={relatedMatches}></RelatedPills>
    </div>

    <div className="w-[50vw]" >
      <ImageSection imageQuery={resultName} />
    </div>
  </div>);
}
