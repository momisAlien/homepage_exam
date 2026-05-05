import { NextResponse } from "next/server";
import { SolapiMessageService, type RequestSendMessagesSchema } from "solapi";

export const runtime = "nodejs";

const CONTACT_TYPES = new Set(["전화 상담", "문자 상담", "카카오톡 상담", "방문 상담"]);

type ReservationPayload = {
  name: string;
  phone: string;
  contactType: string;
  message: string;
};

type ApiResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

function jsonResponse(body: ApiResponse, status: number) {
  return NextResponse.json(body, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readTextField(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: string) {
  return value.replace(/[^\d]/g, "");
}

function assertCustomerPhone(phone: string) {
  return /^01[016789]\d{7,8}$/.test(phone);
}

function assertServicePhone(phone: string) {
  return /^\d{8,11}$/.test(phone);
}

function getRequiredEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

async function parseReservationPayload(request: Request): Promise<ReservationPayload> {
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) {
    throw new Error("상담 신청 데이터가 올바르지 않습니다.");
  }

  const name = readTextField(body, "name");
  const phone = normalizePhone(readTextField(body, "phone"));
  const contactType = readTextField(body, "contactType");
  const message = readTextField(body, "message").slice(0, 500);

  if (name.length < 2 || name.length > 30) {
    throw new Error("이름은 2자 이상 30자 이하로 입력해 주세요.");
  }

  if (!assertCustomerPhone(phone)) {
    throw new Error("연락처는 휴대폰 번호 형식으로 입력해 주세요.");
  }

  if (!CONTACT_TYPES.has(contactType)) {
    throw new Error("희망 상담 방식을 다시 선택해 주세요.");
  }

  return {
    name,
    phone,
    contactType,
    message,
  };
}

export async function POST(request: Request) {
  let reservation: ReservationPayload;

  try {
    reservation = await parseReservationPayload(request);
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : "상담 신청 데이터를 확인해 주세요.",
      },
      400,
    );
  }

  try {
    const apiKey = getRequiredEnv("SOLAPI_API_KEY");
    const apiSecret = getRequiredEnv("SOLAPI_API_SECRET");
    const from = normalizePhone(getRequiredEnv("SOLAPI_FROM_NUMBER"));
    const ownerPhone = normalizePhone(getRequiredEnv("OWNER_PHONE"));

    if (!assertServicePhone(from) || !assertServicePhone(ownerPhone)) {
      throw new Error("Solapi 발신번호 또는 운영자 번호 형식이 올바르지 않습니다.");
    }

    const solapi = new SolapiMessageService(apiKey, apiSecret);
    const customerMessage = reservation.message || "없음";

    const messages: RequestSendMessagesSchema = [
      {
        to: ownerPhone,
        from,
        autoTypeDetect: true,
        text: `[원주 신림 전원주택 상담 신청]
이름: ${reservation.name}
연락처: ${reservation.phone}
상담 방식: ${reservation.contactType}
문의: ${customerMessage}`,
      },
      {
        to: reservation.phone,
        from,
        autoTypeDetect: true,
        text: `[원주 신림 전원주택]
상담 신청이 접수되었습니다.
담당자가 확인 후 방문 일정과 상담 안내를 연락드리겠습니다.`,
      },
    ];

    await solapi.send(messages, { allowDuplicates: true });

    return jsonResponse(
      {
        ok: true,
        message: "상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.",
      },
      200,
    );
  } catch (error) {
    console.error("Solapi reservation SMS failed", error);
    return jsonResponse(
      {
        ok: false,
        error: "문자 발송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      },
      500,
    );
  }
}
