import { type FC } from "react";
import { RecordEditForm } from "../../../../shared/components/record-edit-form/record-edit-form";
import {
  genHeaderText,
  EditAccessStatus,
  genTabHeaderText,
  type HeaderParType,
} from "../../../../shared/utils/utils";
import styles from "../../../../shared/styles/standart-form.module.css";
import { useThingDetails } from "../../hooks/use-thing-details";
import { RecordControlBlock } from "../../../../shared/components/record-control-block";
import {
  genThingURL,
} from "../../../../app/router/navigation";
// import { RecordImage } from "../../../../shared/components/RecordImage/RecordImage";
import { type ThingAdd, type ThingDetail } from "../../types/thing-types";
import { Input } from "../../../../shared/ui/input";
import { appRoutesURL } from "../../../../app/router/app-routes-URL";
import { RecordImage } from "../../../../shared/components/record-image/record-image";

import stylesThingDetails from "./thing-details.module.scss";

/**
 * Чистый компонент редактирования автора
 */
export type ThingDetailsProps = {
  thingDetailsHookRes: ReturnType<typeof useThingDetails>;
  gotoThingList: () => void;
  gotoThing: (id: number) => void;
};

export const ThingDetails: FC<ThingDetailsProps> = ({
  thingDetailsHookRes,
  gotoThingList,
  gotoThing,
}: ThingDetailsProps) => {
  const { form, status, record } = thingDetailsHookRes;

  const params: HeaderParType = [
    status.editAccessStatus === EditAccessStatus.Readonly,
    record.currentRecord?.id ? Number(record.currentRecord?.id) : null,
    record.currentRecord?.name,
    "вещи",
    "жен"
  ];
  const header = genHeaderText(...params);
  const tabHeader = genTabHeaderText(...params);

  const inputProps = {
    classes: {
      classBlockAdd: styles.input_block,
      classLabelAdd: styles.label,
      classInputAdd: styles.input,
    },
    readOnly: status.editAccessStatus === EditAccessStatus.Readonly,
    onChange: form?.handleChange ?? (() => {}),
  };

  return (
    <>

      <RecordEditForm
        backLink={appRoutesURL.things}
        header={header}
        onSubmit={record.handleSubmitAction}
        sliceState={status.sliceStates}
        error={status.errorText}
        fetchRecord={record.fetchRecord}
      >
        <section className={styles.form__content}>
          <div className={styles.form__content__text}>
            <Input
              name="name"
              label="Название:"
              value={form?.values.name ?? ""}
              minLength={5}
              required
              {...inputProps}
            />
            {form && form.values.UIN && <Input
              name="UIN"
              label="Код вещи:"
              value={form.values.UIN}
              multiline={false}
              disabled
              {...inputProps}
            />}
            <Input
              name="description"
              label="Сообщение:"
              value={form?.values.description ?? ""}
              minLength={2}
              required
              {...inputProps}
            />
          <div className={stylesThingDetails.prompt_image}>
            <p className={stylesThingDetails.prompt_image_load}>
              Загрузите фотографию вещи
            </p>
            <p className={stylesThingDetails.prompt_image_size}>
              фото до 10 МБ
            </p>
          </div>
          <RecordImage 
            imageURL={form  && form.values.image_URL_brief
              ? form.values.image_URL_brief
              : null}
            newImageURL={form?.values.new_image_URL}
            readOnly={status.editAccessStatus === EditAccessStatus.Readonly}
            uploadFileAction={record.uploadFileAction}
            deleteImage={() => {
              form?.setEditStarted(true);
              form?.setValues({ ...form?.values, new_image_URL: null });
            }}
          />


          </div>
        </section>
        <RecordControlBlock
          entityDetailsHook={thingDetailsHookRes}
          gotoEntityList={gotoThingList}
          gotoEntityEdit={gotoThing}
        />
      </RecordEditForm>
    </>
  );
};
